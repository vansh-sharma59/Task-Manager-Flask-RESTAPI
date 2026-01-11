from .user_management import user_admin_bp
from .task_management import task_admin_bp
from .system_monitoring import monitor_bp

__all__ = ['user_admin_bp', 'task_admin_bp', 'monitor_bp']