import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isInRange', async: false })
export class IsInRangeConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const [min, max] = args.constraints;
    return value > min && value < max;
  }

  defaultMessage(args: ValidationArguments) {
    const [min, max] = args.constraints;
    return `Each number should be greater than ${min} and less than ${max}`;
  }
}

export function IsInRange(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: IsInRangeConstraint,
    });
  };
}
