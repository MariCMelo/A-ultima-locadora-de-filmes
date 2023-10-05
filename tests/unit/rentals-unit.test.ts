import * as moviesRepository from "../../src/repositories/rentals-repository"
import * as rentalRepository from "../../src/repositories/rentals-repository"
import * as usersRepository from "../../src/repositories/movies-repository"
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

  // it("create Rental", async () => {

  //   const rentalInput: RentalInput = {
  //     userId: faker.number.int(), 
  //     moviesId: faker.helpers.arrayElements([])
  //   };
  //   const mock = jest.spyOn(rentalRepository, "createRental");
  //   mock.mockImplementationOnce((): any => {
  //     return 
      

  //   });

  //   const rental = await rentalsService.createRental(rentalInput)
  //   console.log(rental)
  //   expect(rentalRepository.createRental).toBeCalledTimes(1);
  //   expect(rental).toBe(200)
  //   expect(true).toBe(true);
  // })

  it("finish rental error not found", async () => {

    const mock = jest.spyOn(rentalRepository, "getRentalById");
    mock.mockImplementationOnce((rentalId: number): any => {
      return 

    });

    const rental = await rentalsService.getRentalById(1877765555)
    console.log(rental)
    console.log('oi')
    expect(rentalRepository.getRentalById).toBeCalledTimes(1);
    expect(rental).toEqual({
      status: "Rental not found."
    });
    expect(true).toBe(true);
  })
})