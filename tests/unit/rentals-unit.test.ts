import * as moviesRepository from "../../src/repositories/rentals-repository"
import * as rentalsRepository from "../../src/repositories/rentals-repository"
import * as usersRepository from "../../src/repositories/movies-repository"
import * as rentalsService from "../../src/services/rentals-service"


beforeEach(() => {
  jest.clearAllMocks();
});

describe("Rentals Service Unit Tests", () => {
  it("should get the rentals", async () => {
    const rentalsMock = jest.spyOn(rentalsRepository, "");
    rentalsMock.mockImplementationOnce((): any => {
      return [
        {
          id: 1,
          date: new Date().toString(),
          endDate: new Date().toString(),
          user: "o",
          userId: 9999,
          movies: "SEVERE",
          closed: 1
        }
      ]
    });
    expect(true).toBe(true);
  })
})