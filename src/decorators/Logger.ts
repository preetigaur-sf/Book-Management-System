export function Logger(
  
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    
    
    console.log(`Method called: ${propertyKey}`)
    return originalMethod.apply(this, args)
  }

  return descriptor
}