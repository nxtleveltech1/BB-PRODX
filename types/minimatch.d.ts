declare module "minimatch" {
  interface MinimatchOptions {
    nocase?: boolean
    dot?: boolean
    noglobstar?: boolean
    noext?: boolean
    matchBase?: boolean
    flipNegate?: boolean
    nonegate?: boolean
    nocomment?: boolean
    partial?: boolean
    debug?: boolean
  }

  interface MinimatchInstance {
    pattern: string
    options: MinimatchOptions
    makeRe(): RegExp
    match(list: string[], index?: boolean): boolean[] | string[]
  }

  function minimatch(target: string, pattern: string, options?: MinimatchOptions): boolean

  namespace minimatch {
    export type IOptions = MinimatchOptions
    export type MinimatchOptions = MinimatchOptions
    export class Minimatch implements MinimatchInstance {
      constructor(pattern: string, options?: MinimatchOptions)
      pattern: string
      options: MinimatchOptions
      makeRe(): RegExp
      match(list: string[], index?: boolean): boolean[] | string[]
    }
  }

  export = minimatch
}
