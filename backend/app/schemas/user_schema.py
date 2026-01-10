from ..extensions import ma
from ..models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        sqla_session = None

user_schema = UserSchema(exclude=('password',)) #never send password back
users_schema = UserSchema(many=True, exclude=('password',))