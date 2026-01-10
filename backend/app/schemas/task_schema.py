from ..extensions import ma
from ..models.task import Task

class TaskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Task
        load_instance = True
        include_fk = True
        sqla_session = None

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)