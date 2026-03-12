export function Logger(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Method called: ${propertyKey}`);
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
