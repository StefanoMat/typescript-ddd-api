import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SubTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new EncrypterStub()
}
const makeSut = (): SubTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Shoul call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountFields = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
    await sut.add(accountFields)
    expect(encryptSpy).toHaveBeenCalledWith('valid_pass')
  })

  test('Shoul throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountFields = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
    const promise = sut.add(accountFields)
    await expect(promise).rejects.toThrow()
  })
})
