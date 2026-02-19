export function Log(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
  
    console.log(`Method: ${propertyName}`);
    console.log("Arguments:", args);
    console.log("Time:", new Date().toISOString());

    try {
      const result = await originalMethod.apply(this, args);
      console.log(`Method ${propertyName} executed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in ${propertyName}:`, error);
      throw error;
    } 
      
  };

  return descriptor;
}
