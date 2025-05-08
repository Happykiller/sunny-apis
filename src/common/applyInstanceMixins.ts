// src\common\applyInstanceMixins.ts
export function applyInstanceMixins<T>(
  target: T,
  classes: (new (...args: any[]) => any)[],
  args: any[]
): void {
  for (const Ctor of classes) {
    const instance = new Ctor(...args);
    const proto = Object.getPrototypeOf(instance);

    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key !== 'constructor') {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(proto, key)!
        );
      }
    }

    for (const key of Object.keys(instance)) {
      (target as any)[key] = instance[key];
    }
  }
}