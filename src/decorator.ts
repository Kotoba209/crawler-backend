// 装饰器本身就是一个函数
// 类接收的参数是构造函数
// 装饰器通过 @ 符号来使用

// function testDecorator<T extends new (...args: any[])  => {}>(constructor: T) {
//   return class extends constructor {
//     name = 'decorator'
//     getName() {
//       return this.name
//     }
//   }
//   // constructor.prototype.getName = () => {
//   //   console.log('zhangsan')
//   // }
// }

// @testDecorator
// class Test {
//   name: string
//   constructor(name: string) {
//     this.name = name
//   }
// }

// const test = new Test('class');

// console.log('test', test)

// (test as any).getName()

function testDecorator() {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    return class extends constructor {
      name = "decorator";
      getName() {
        return this.name;
      }
    };
  };
}

const Test1 = testDecorator()(class {
  name: string
  constructor(name: string) {
    this.name = name
  }
})

const test1 = new Test1('class')

// 方法装饰器

// 静态方法 target 是类构造函数， 否则是 prototype
function getNameDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log('target', target)
  descriptor.writable = false // 设置属性不能被修改
}

class Test2 {
  name: string
  constructor(name: string) {
    this.name = name
  }
  @getNameDecorator
  getName() {
    return this.name
  }
}

// 访问器的装饰器

function visitDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log('target', target)
  descriptor.writable = false
}

class Test3 {
  private _name: string
  constructor(name: string) {
    this._name = name
  }
  get name() {
    return this._name
  }
  @visitDecorator
  set name(name: string) {
    this._name = name
  }
}

const test3 = new Test3('class')

// 属性装饰器

function propDecorator(target: any, key: string): any {
  console.log('target', target, key)
  // 设置对象描述符，不可修改等
  const descriptor: PropertyDescriptor = {
    writable: false
  }
  return descriptor
}

// 这里的name 放在实例上
class Test4 {
  @propDecorator
  name = "class4"
}

const test4 = new Test4()
