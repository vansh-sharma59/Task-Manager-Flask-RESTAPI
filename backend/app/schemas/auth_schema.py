from marshmallow import fields, Schema, validate, validates_schema, ValidationError

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8, max=25))
    confirm_password = fields.Str(required=True, load_only=True)

    @validates_schema
    def validate_password(self, data, **kwargs):
        # checks if password == confirm password
        if data.get('password') != data.get('confirm_password'):
            raise ValidationError('password must match', field_name='confirm_password')
        
    
class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, max=25))


register_schema = RegisterSchema()
login_schema = LoginSchema()