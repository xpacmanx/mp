# Интеграция с Django Backend для загрузки изображений

## Необходимые пакеты

```bash
pip install Pillow
pip install django-cors-headers  # если фронтенд на другом домене
```

## Модель пользователя

```python
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from PIL import Image
import os

class User(AbstractUser):
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)
    birthdate = models.DateField(null=True, blank=True)
    telegram_nick = models.CharField(max_length=100, blank=True)
    telegram_id = models.CharField(max_length=100, blank=True)
    
    # Поля для изображений
    photo = models.ImageField(upload_to='user_photos/', null=True, blank=True)
    photo_large = models.ImageField(upload_to='user_photos/large/', null=True, blank=True)
    photo_small = models.ImageField(upload_to='user_photos/small/', null=True, blank=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Создаем превью после сохранения оригинала
        if self.photo:
            self.create_photo_previews()
    
    def create_photo_previews(self):
        if not self.photo:
            return
            
        # Открываем оригинальное изображение
        img = Image.open(self.photo.path)
        
        # Создаем большое превью (400x400)
        large_size = (400, 400)
        img_large = img.copy()
        img_large.thumbnail(large_size, Image.Resampling.LANCZOS)
        
        # Создаем квадратное изображение
        width, height = img_large.size
        size = min(width, height)
        left = (width - size) // 2
        top = (height - size) // 2
        img_large = img_large.crop((left, top, left + size, top + size))
        img_large = img_large.resize(large_size, Image.Resampling.LANCZOS)
        
        # Сохраняем большое превью
        large_path = self.photo.path.replace('/user_photos/', '/user_photos/large/')
        os.makedirs(os.path.dirname(large_path), exist_ok=True)
        img_large.save(large_path, 'JPEG', quality=85)
        self.photo_large = large_path.replace(settings.MEDIA_ROOT, '').lstrip('/')
        
        # Создаем маленькое превью (80x80)
        small_size = (80, 80)
        img_small = img_large.copy()
        img_small = img_small.resize(small_size, Image.Resampling.LANCZOS)
        
        # Сохраняем маленькое превью
        small_path = self.photo.path.replace('/user_photos/', '/user_photos/small/')
        os.makedirs(os.path.dirname(small_path), exist_ok=True)
        img_small.save(small_path, 'JPEG', quality=75)
        self.photo_small = small_path.replace(settings.MEDIA_ROOT, '').lstrip('/')
        
        # Сохраняем модель без рекурсии
        User.objects.filter(pk=self.pk).update(
            photo_large=self.photo_large,
            photo_small=self.photo_small
        )
```

## Сериализатор

```python
# serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    photo_large_url = serializers.SerializerMethodField()
    photo_small_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'birthdate', 'telegram_nick', 'telegram_id', 'role',
            'photo', 'photo_url', 'photo_large_url', 'photo_small_url'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'photo': {'write_only': True}  # Не возвращаем путь к файлу
        }
    
    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None
    
    def get_photo_large_url(self, obj):
        if obj.photo_large:
            return self.context['request'].build_absolute_uri(obj.photo_large.url)
        return None
    
    def get_photo_small_url(self, obj):
        if obj.photo_small:
            return self.context['request'].build_absolute_uri(obj.photo_small.url)
        return None

class UserCreateUpdateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'birthdate', 'telegram_nick', 'telegram_id', 'role',
            'password', 'password2', 'photo'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }
    
    def validate(self, data):
        if 'password' in data and 'password2' in data:
            if data['password'] != data['password2']:
                raise serializers.ValidationError("Пароли не совпадают")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password', None)
        
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        return user
    
    def update(self, instance, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
```

## Views

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User
from .serializers import UserSerializer, UserCreateUpdateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Возвращаем пользователя с URL-ами изображений
        response_serializer = UserSerializer(user, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Возвращаем пользователя с URL-ами изображений
        response_serializer = UserSerializer(user, context={'request': request})
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """Отдельный endpoint для загрузки фото"""
        user = self.get_object()
        
        if 'photo' not in request.FILES:
            return Response(
                {'error': 'Файл не найден'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.photo = request.FILES['photo']
        user.save()
        
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
```

## URL конфигурация

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

## Настройки Django

```python
# settings.py
import os

# Медиа файлы
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Максимальный размер файла (10MB)
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

# CORS настройки (если фронтенд на другом домене)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

## Обновление фронтенда для использования API

В `UserForm.vue` нужно обновить метод отправки:

```javascript
// В UserForm.vue - метод onSubmit
function onSubmit() {
  // ... валидация ...
  
  // Отправляем FormData напрямую
  emit('submit', formData)
}
```

В родительском компоненте:

```javascript
// В родительском компоненте (например, UserListView.vue)
async function handleUserSubmit(formData) {
  try {
    const response = await fetch('/api/users/', {
      method: 'POST',
      body: formData, // FormData автоматически установит правильные заголовки
      headers: {
        'Authorization': `Bearer ${token}` // если используете токены
      }
    })
    
    if (response.ok) {
      const userData = await response.json()
      console.log('Пользователь создан:', userData)
      // userData будет содержать photo_url, photo_large_url, photo_small_url
    }
  } catch (error) {
    console.error('Ошибка создания пользователя:', error)
  }
}
```

## Дополнительные возможности

### Валидация изображений на бекенде

```python
# validators.py
from django.core.exceptions import ValidationError
from PIL import Image

def validate_image_size(image):
    """Валидация размера изображения"""
    img = Image.open(image)
    width, height = img.size
    
    if width < 100 or height < 100:
        raise ValidationError('Минимальный размер изображения: 100x100 пикселей')
    
    if width > 4000 or height > 4000:
        raise ValidationError('Максимальный размер изображения: 4000x4000 пикселей')

def validate_image_format(image):
    """Валидация формата изображения"""
    try:
        img = Image.open(image)
        if img.format not in ['JPEG', 'PNG', 'GIF', 'WEBP']:
            raise ValidationError('Поддерживаемые форматы: JPEG, PNG, GIF, WEBP')
    except Exception:
        raise ValidationError('Неверный формат изображения')

# В models.py добавить валидаторы:
from .validators import validate_image_size, validate_image_format

class User(AbstractUser):
    photo = models.ImageField(
        upload_to='user_photos/', 
        null=True, 
        blank=True,
        validators=[validate_image_size, validate_image_format]
    )
```

Этот подход обеспечивает полную интеграцию между Vue.js фронтендом и Django бекендом с автоматической обработкой изображений и созданием превью разных размеров. 