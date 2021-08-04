import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { compare } from  'bcryptjs'
import { sign } from 'jsonwebtoken'

interface IAuthenticateRequest {
  email: string;
  password: string;
}

export class AuthenticateUserService {

  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    // Verificar se email existe
    const user = await usersRepositories.findOne({ email })
    if (!user) {
      throw new Error('Email/Password incorrect')
    }

    // Verificar se senha está correta
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Email/Password incorrect')
    }
    
    // Gerar token
    const token = await sign({
      email: user.email,
    },
    '6425ddbf9cd648e1e4d33c4340d3373d', // nlwvaloriza
    {
      subject: user.id,
      expiresIn: "1d" // 1 dia
    })

    return token
  }
}