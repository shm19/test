import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsTimeFormatValidConstraint
  implements ValidatorConstraintInterface
{
  validate(time: Date): boolean {
    const date = new Date(time);
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return seconds === 0 && milliseconds === 0;
  }

  defaultMessage(): string {
    return 'Invalid time format. Time should not have seconds or milliseconds.';
  }
}

export function IsTimeFormatValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeFormatValidConstraint,
    });
  };
}
