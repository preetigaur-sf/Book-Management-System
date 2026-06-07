export function authorize(role: string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const currentUserRole = 'admin';

      if (currentUserRole !== role) {
        throw new Error('Access Denied');
      }

      console.log(`Authorization successful for ${propertyKey}`);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
