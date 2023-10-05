import * as moviesRepository from "../../src/repositories/movies-repository"
import * as rentalRepository from "../../src/repositories/rentals-repository"
import * as usersRepository from "../../src/repositories/users-repository"
import * as rentalsService from "../../src/services/rentals-service"
import { faker } from "@faker-js/faker";
import { number } from "joi";
import { RentalInput } from "protocols";




beforeEach(() => {
  jest.clearAllMocks();
});

describe("Rentals Service Unit Tests", () => {
  it("should get the rentals", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentals");
    mock.mockImplementationOnce((): any => {
      return {
        id: faker.number.int(),
        date: new Date(),
        endDate: new Date(),
        user: "Fake User",
        userId: 9,
        movies: faker.helpers.arrayElement(['cat']),
        closed: faker.datatype.boolean()
      }

    });

    const rental = await rentalsService.getRentals()
    expect(rentalRepository.getRentals).toBeCalledTimes(1);
    expect(rental).toEqual({
      id: expect.any(Number),
      date: expect.any(Date),
      endDate: expect.any(Date),
      user: expect.any(String),
      userId: expect.any(Number),
      movies: expect.any(String),
      closed: expect.any(Boolean)
    })
    expect(true).toBe(true);
  })

  it("should get the rental by id", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentalById");
    mock.mockImplementationOnce((id: number): any => {
      return {
        id,
        date: new Date(),
        endDate: new Date(),
        user: "Fake User",
        userId: 9,
        movies: faker.helpers.arrayElement(['cat']),
        closed: faker.datatype.boolean()
      }

    });

    const rental = await rentalsService.getRentalById(123)
    expect(rentalRepository.getRentalById).toBeCalledTimes(1);
    expect(rental).toEqual({
      id: 123,
      date: expect.any(Date),
      endDate: expect.any(Date),
      user: expect.any(String),
      userId: expect.any(Number),
      movies: expect.any(String),
      closed: expect.any(Boolean)
    })
    expect(true).toBe(true);
  })

  it("finish rental sucess", async () => {

    const mock = jest.spyOn(rentalRepository, "finishRental");
    mock.mockImplementationOnce((rentalId: number): any => {
      return {
        rentalId: null
      }

    });

    const mock1 = jest.spyOn(rentalRepository, "getRentalById");
    mock1.mockImplementationOnce((rentalId: number): any => {
      return {
        rentalId,
      }

    });
    const rental = await rentalsService.finishRental(1)
    expect(rentalRepository.getRentalById).toBeCalledTimes(1);
    expect(rental).toEqual(undefined);
    expect(true).toBe(true);
  })

  it("finish rental error not found", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentalById");
    mock.mockImplementationOnce((rentalId: number): any => {
      return undefined

    });
    const mock1 = jest.spyOn(rentalRepository, "finishRental");
    mock1.mockImplementationOnce((rentalId: number): any => {
      return undefined
    });

    const rental = rentalsService.finishRental(1)
    expect(rentalRepository.getRentalById).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      name: "NotFoundError",
      message: "Rental not found."
    });
    expect(true).toBe(true);
  })

  it("get user by rental", async () => {

    const mock = jest.spyOn(usersRepository, "getById");
    mock.mockImplementationOnce((userId: number): any => {
      return {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        cpf: faker.number.bigInt(),
        birthDate: faker.date.birthdate()
      }

    });
    const rental = await rentalsService.getUserForRental(1)
    expect(usersRepository.getById).toBeCalledTimes(1);
    expect(rental).toEqual({
      id: 1,
      firstName: rental.firstName,
      lastName: rental.lastName,
      email: rental.email,
      cpf: rental.cpf,
      birthDate: rental.birthDate
    });
    expect(true).toBe(true);
  })

  it("get user by rental error", async () => {

    const mock = jest.spyOn(usersRepository, "getById");
    mock.mockImplementationOnce((userId: number): any => {
      return undefined
    });
    const rental = rentalsService.getUserForRental(1)
    expect(usersRepository.getById).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      name: "NotFoundError",
      message: "User not found."
    });
    expect(true).toBe(true);
  })

  it("checkUserAbleToRental", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentalsByUserId");
    mock.mockImplementationOnce((userId: number): any => {
      return [{
        id: userId,
        date: new Date(),
        endDate: new Date(),
        user: "Fake User",
        userId: 9,
        closed: false
      }]
    });

    const rental = rentalsService.checkUserAbleToRental(1)
    expect(rentalRepository.getRentalsByUserId).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      name: "PendentRentalError",
      message: "The user already have a rental!"
    });
    expect(true).toBe(true);
  })

  it("checkUserAbleToRental undefined", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentalsByUserId");
    mock.mockImplementationOnce((userId: number): any => {
      return {
        id: userId,
        date: new Date(),
        endDate: new Date(),
        user: "Fake User",
        userId: 9,
        closed: false
      }
    });
    const rental = await rentalsService.checkUserAbleToRental(1)
    expect(rentalRepository.getRentalsByUserId).toBeCalledTimes(1);
    expect(rental).toEqual(undefined);
    expect(true).toBe(true);
  })


  it("checkMoviesValidForRental", async () => {

    const user = {
      id: 1,
      firstName: `Luciana`,
      lastName: `Alves`,
      email: `lalala@gmail.com`,
      cpf: `989284567834`,
      birthDate: new Date(1995, 11, 17)
    }

    const mock = jest.spyOn(moviesRepository, "getById");
    mock.mockImplementationOnce((userId: number): any => {
      return {
        id: userId,
        name: faker.animal.dog(),
        adultsOnly: faker.datatype.boolean(),
        rentalId: faker.number.int(),
      }
    });
    const rental = rentalsService.checkMoviesValidForRental([1], user)
    expect(moviesRepository.getById).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      name: "MovieInRentalError",
      message: "Movie already in a rental."
    });
    expect(true).toBe(true);
  })

  it("checkMoviesValidForRental", async () => {

    const user = {
      id: 1,
      firstName: `Luciana`,
      lastName: `Alves`,
      email: `lalala@gmail.com`,
      cpf: `989284567834`,
      birthDate: new Date(2010, 11, 17)
    }

    const mock = jest.spyOn(moviesRepository, "getById");
    mock.mockImplementationOnce((userId: number): any => {
      return {
        id: userId,
        name: faker.animal.dog(),
        adultsOnly: true,
        Rental: faker.number.int(),
      }
    });
    const rental = rentalsService.checkMoviesValidForRental([1], user)
    expect(moviesRepository.getById).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      "message": "Cannot see that movie.",
      "name": "InsufficientAgeError"
    });
    expect(true).toBe(true);
  })

  it("checkMoviesValidForRental", async () => {

    const user = {
      id: 1,
      firstName: `Luciana`,
      lastName: `Alves`,
      email: `lalala@gmail.com`,
      cpf: `989284567834`,
      birthDate: new Date(2010, 11, 17)
    }

    const mock = jest.spyOn(moviesRepository, "getById");
    mock.mockImplementationOnce((userId: number): any => {
      return undefined
    });
    const rental = rentalsService.checkMoviesValidForRental([1], user)
    expect(moviesRepository.getById).toBeCalledTimes(1);
    expect(rental).rejects.toEqual({
      name: "NotFoundError",
      message: "Movie not found."
    });
    expect(true).toBe(true);
  })
})