export function logExecution() {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]): Promise<any> {
      console.log(`Method ${propertyKey} executed`);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
