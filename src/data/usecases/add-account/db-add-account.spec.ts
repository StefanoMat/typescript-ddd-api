import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/ecnrypter'

interface SubTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SubTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  const encrypterStub = new EncrypterStub()
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
})
