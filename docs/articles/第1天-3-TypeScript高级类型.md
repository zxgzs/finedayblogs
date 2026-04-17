# 🔥 TypeScript 高级类型技巧让你的代码更安全

> 掌握TypeScript的高级类型系统，包括泛型、条件类型、映射类型等，让你的代码更加类型安全和可维护

## 前言

TypeScript的静态类型系统是其最大的优势之一，但很多开发者只停留在基础类型的使用上。本文将介绍TypeScript的高级类型技巧，帮助你写出更类型安全、更易维护的代码。

## 泛型（Generics）

泛型让我们能够创建可复用的组件，同时保持类型安全。

### 基础泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

const num = identity<number>(1)        // number
const str = identity<string>('hello')  // string
const bool = identity(true)             // 自动推断为 boolean
```

### 泛型接口

```typescript
interface Box<T> {
  value: T
}

const numberBox: Box<number> = { value: 42 }
const stringBox: Box<string> = { value: 'hello' }
```

### 泛型类

```typescript
class Storage<T> {
  private items: T[] = []

  add(item: T) {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const numberStorage = new Storage<number>()
numberStorage.add(1)
numberStorage.add(2)

const stringStorage = new Storage<string>()
stringStorage.add('hello')
```

### 泛型约束

使用`extends`约束泛型类型：

```typescript
// ❌ 错误：无法保证有length属性
function getLength<T>(arg: T): number {
  return arg.length
}

// ✅ 正确：约束必须有length属性
interface Lengthwise {
  length: number
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length
}

getLength('hello')        // 5
getLength([1, 2, 3])      // 3
// getLength(3)           // 错误：number没有length属性
```

### keyof 操作符

```typescript
// 获取对象的所有key
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
}

const name = getProperty(user, 'name')  // string
const age = getProperty(user, 'age')    // number
// getProperty(user, 'gender')           // 错误：'gender'不是user的key
```

### 实战案例：API请求封装

```typescript
// 通用API响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 文章类型
interface Article {
  id: number
  title: string
  content: string
  views: number
}

// 用户类型
interface User {
  id: number
  name: string
  email: string
}

// 通用请求函数
async function fetchApi<T>(
  url: string
): Promise<ApiResponse<T>> {
  const response = await fetch(url)
  return response.json()
}

// 使用
const articlesResponse = await fetchApi<Article[]>('/api/articles')
// articlesResponse.data 的类型是 Article[]

const userResponse = await fetchApi<User>('/api/user')
// userResponse.data 的类型是 User
```

## 条件类型

条件类型根据条件选择不同的类型：

### 基础条件类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type T1 = NonNullable<string | null>   // string
type T2 = NonNullable<number>           // number
type T3 = NonNullable<null | undefined> // never
```

### 分发条件类型

```typescript
type ToArray<T> = T extends any ? T[] : never

type T1 = ToArray<string>   // string[]
type T2 = ToArray<number>   // number[]
type T3 = ToArray<string | number>  // string[] | number[]
```

### 推断类型

使用`infer`推断类型：

```typescript
// 提取Promise的返回类型
type PromiseReturnType<T> = T extends Promise<infer U> ? U : T

type T1 = PromiseReturnType<Promise<string>>  // string
type T2 = PromiseReturnType<number>           // number

// 提取函数的返回类型
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type T3 = FunctionReturnType<() => string>  // string
type T4 = FunctionReturnType<(x: number) => boolean>  // boolean
```

### 实战案例：深度Partial

```typescript
// 原始Partial只做一层
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 深度Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

interface User {
  id: number
  name: string
  profile: {
    bio: string
    avatar: string
  }
}

type PartialUser = DeepPartial<User>
// {
//   id?: number
//   name?: string
//   profile?: {
//     bio?: string
//     avatar?: string
//   }
// }
```

## 映射类型

映射类型让我们可以批量转换类型。

### 基础映射类型

```typescript
// 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 将所有属性变为必需
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// 将所有属性变为只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### 修饰符映射

```typescript
// 移除readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// 添加readonly
type Immutable<T> = {
  +readonly [P in keyof T]: T[P]
}

// 移除可选
type NonOptional<T> = {
  [P in keyof T]-?: T[P]
}
```

### 实战案例：API请求参数类型

```typescript
// 基础参数类型
interface CreateArticleParams {
  title: string
  content: string
  category: string
  tags: string[]
  isPublished: boolean
}

// 创建时所有字段必需
type CreateArticle = Required<CreateArticleParams>

// 更新时所有字段可选
type UpdateArticle = Partial<CreateArticleParams>

// 查询时只读
type QueryArticle = Readonly<Pick<CreateArticleParams, 'category' | 'tags'>>

// 使用
async function createArticle(params: CreateArticle) {
  // params必须包含所有字段
}

async function updateArticle(id: number, params: UpdateArticle) {
  // params所有字段可选
}

async function queryArticle(query: QueryArticle) {
  // query是只读的
}
```

### 实战案例：表单验证

```typescript
// 表单验证错误类型
type FormErrors<T> = {
  [P in keyof T]?: string[]
}

// 表单数据类型
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

// 验证错误类型
type LoginErrors = FormErrors<LoginForm>

// 使用
const errors: LoginErrors = {
  email: ['邮箱格式不正确'],
  password: ['密码长度至少6位']
}

// 清除错误
function clearErrors<T extends object>(errors: FormErrors<T>): void {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof T]
  })
}
```

## 类型推断与断言

### 类型推断

```typescript
// 函数返回类型推断
function sum(a: number, b: number) {
  return a + b  // 自动推断为number
}

// 对象类型推断
const user = {
  name: 'John',
  age: 30
}
// 类型自动推断为 { name: string; age: number }

// 数组类型推断
const numbers = [1, 2, 3]  // number[]
const mixed = [1, 'hello', true]  // (number | string | boolean)[]
```

### 类型断言

```typescript
// 尖括号语法
const value: any = 'hello'
const length: number = (<string>value).length

// as语法（推荐，JSX中必须使用）
const length2: number = (value as string).length
```

### 类型守卫

```typescript
// typeof类型守卫
function printLength(str: string | number) {
  if (typeof str === 'string') {
    console.log(str.length)  // 这里str是string类型
  } else {
    console.log(str.toString().length)  // 这里str是number类型
  }
}

// instanceof类型守卫
class Cat {
  meow() {}
}

class Dog {
  bark() {}
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow()  // animal是Cat类型
  } else {
    animal.bark()  // animal是Dog类型
  }
}

// 自定义类型守卫
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim()  // pet是Fish类型
  } else {
    pet.fly()   // pet是Bird类型
  }
}
```

## 实用工具类型

### Pick

从类型中选择部分属性：

```typescript
interface User {
  id: number
  name: string
  email: string
  age: number
  address: string
}

// 只选择id和name
type UserInfo = Pick<User, 'id' | 'name'>
// { id: number; name: string }

// 使用
const info: UserInfo = {
  id: 1,
  name: 'John'
}
```

### Omit

从类型中排除部分属性：

```typescript
// 排除id和password
type UserPublic = Omit<User, 'id' | 'password'>
// { name: string; email: string; age: number; address: string }

// 使用
const publicUser: UserPublic = {
  name: 'John',
  email: 'john@example.com',
  age: 30,
  address: 'Beijing'
}
```

### Record

创建对象类型：

```typescript
// 创建一个对象，所有属性都是number
type Scores = Record<string, number>
// { [key: string]: number }

const scores: Scores = {
  math: 90,
  english: 85,
  chinese: 95
}

// 更复杂的用法
type ArticleMap = Record<number, Article>
// { [key: number]: Article }
```

### Exclude

从联合类型中排除某些类型：

```typescript
type T = string | number | boolean

type T1 = Exclude<T, number>  // string | boolean
type T2 = Exclude<T, string | boolean>  // number
```

### Extract

从联合类型中提取某些类型：

```typescript
type T = string | number | boolean

type T1 = Extract<T, string | number>  // string | number
type T2 = Extract<T, boolean>  // boolean
```

### ReturnType

获取函数的返回类型：

```typescript
function greet(name: string): string {
  return `Hello, ${name}`
}

type GreetReturn = ReturnType<typeof greet>  // string
```

### Parameters

获取函数的参数类型：

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}, ${age}`
}

type GreetParams = Parameters<typeof greet>  // [name: string, age: number]
```

## 实战案例：完整的类型定义

### 博客系统类型定义

```typescript
// ========== 基础类型 ==========

type ID = number
type DateString = string
type URL = string

// ========== 文章相关 ==========

interface Article {
  id: ID
  title: string
  summary: string
  content: string
  date: DateString
  category: string
  tags: string[]
  views: number
  likes: number
  collects: number
  author: string
  isTop?: boolean
  createdAt: DateString
  updatedAt: DateString
}

// 创建文章时不需要id和日期
type CreateArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>

// 更新文章时所有字段可选
type UpdateArticleInput = Partial<CreateArticleInput>

// 文章列表响应
interface ArticleListResponse {
  articles: Article[]
  total: number
  page: number
  pageSize: number
}

// 文章详情响应
interface ArticleDetailResponse extends Article {
  comments: Comment[]
}

// ========== 评论相关 ==========

interface Comment {
  id: ID
  articleId: ID
  author: string
  content: string
  date: DateString
  avatar: string
  parentId?: ID
  likes: number
}

// 创建评论
type CreateCommentInput = Omit<Comment, 'id' | 'date' | 'likes'>

// 评论列表
type CommentListResponse = {
  comments: Comment[]
  total: number
}

// ========== 用户相关 ==========

interface User {
  id: ID
  name: string
  email: string
  avatar?: URL
  bio?: string
  role: 'admin' | 'user' | 'guest'
  createdAt: DateString
}

// 用户注册
interface RegisterInput {
  name: string
  email: string
  password: string
}

// 用户登录
interface LoginInput {
  email: string
  password: string
}

// 登录响应
interface LoginResponse {
  user: Omit<User, 'password'>
  token: string
  refreshToken: string
}

// ========== 分类和标签 ==========

interface Category {
  id: ID
  name: string
  count: number
  description?: string
}

interface Tag {
  id: ID
  name: string
  count: number
}

// ========== API响应 ==========

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

interface ApiError {
  code: number
  message: string
  errors?: Record<string, string[]>
}

// ========== 通用工具类型 ==========

// 分页参数
interface PaginationParams {
  page?: number
  pageSize?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// 分页响应
interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// 表单验证错误
interface FormErrors<T> {
  [K in keyof T]?: string[]
}
```

### 使用示例

```typescript
import {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ApiResponse,
  PaginationParams,
  PaginationResponse,
  FormErrors
} from './types'

// 获取文章列表
async function getArticles(
  params: PaginationParams
): Promise<ApiResponse<PaginationResponse<Article>>> {
  const response = await fetch(`/api/articles?${new URLSearchParams(params as any)}`)
  return response.json()
}

// 创建文章
async function createArticle(
  input: CreateArticleInput
): Promise<ApiResponse<Article>> {
  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  return response.json()
}

// 更新文章
async function updateArticle(
  id: number,
  input: UpdateArticleInput
): Promise<ApiResponse<Article>> {
  const response = await fetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  return response.json()
}

// 表单验证
function validateArticleForm(input: Partial<CreateArticleInput>): FormErrors<CreateArticleInput> {
  const errors: FormErrors<CreateArticleInput> = {}

  if (!input.title || input.title.trim() === '') {
    errors.title = ['标题不能为空']
  }

  if (!input.content || input.content.trim() === '') {
    errors.content = ['内容不能为空']
  }

  if (input.title && input.title.length > 100) {
    errors.title = errors.title || []
    errors.title.push('标题不能超过100个字符')
  }

  return errors
}
```

## 最佳实践

### 1. 优先使用类型推断

```typescript
// ❌ 不推荐：显式指定类型
const user: { name: string; age: number } = {
  name: 'John',
  age: 30
}

// ✅ 推荐：让TypeScript推断
const user = {
  name: 'John',
  age: 30
}
```

### 2. 使用泛型而不是any

```typescript
// ❌ 不推荐：使用any
function identity(arg: any): any {
  return arg
}

// ✅ 推荐：使用泛型
function identity<T>(arg: T): T {
  return arg
}
```

### 3. 定义明确的接口

```typescript
// ❌ 不推荐：过于宽泛
function process(data: object) {
  console.log(data)
}

// ✅ 推荐：明确的接口
interface ProcessData {
  id: number
  name: string
}

function process(data: ProcessData) {
  console.log(data)
}
```

### 4. 使用实用工具类型

```typescript
// ❌ 不推荐：手动复制属性
interface UpdateUser {
  id?: number
  name?: string
  email?: string
  age?: number
}

// ✅ 推荐：使用Partial
interface User {
  id: number
  name: string
  email: string
  age: number
}

type UpdateUser = Partial<User>
```

## 总结

TypeScript的高级类型系统提供了强大的类型安全能力：

1. **泛型**：创建可复用的类型安全组件
2. **条件类型**：根据条件选择不同类型
3. **映射类型**：批量转换类型
4. **工具类型**：简化常见的类型操作
5. **类型守卫**：运行时类型检查

掌握这些高级类型技巧，能让你写出更类型安全、更易维护的代码！

---

**标签**：#TypeScript #类型系统 #前端 #JavaScript #高级类型

**点赞❤️ + 收藏⭐️ + 评论💬，你的支持是我创作的动力！**
