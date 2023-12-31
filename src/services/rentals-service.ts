import { User } from "@prisma/client";

import { notFoundError } from "../errors/notfound-error";
import { RentalInput } from "../protocols";
import { movieAlreadyInRental } from "../errors/movie-inretal-error";
import { insufficientAgeError } from "../errors/insufficientage-error";
import * as usersRepository from "../repositories/users-repository";
import * as rentalsRepository from "../repositories/rentals-repository";
import * as moviesRepository from "../repositories/movies-repository";
import { pendentRentalError } from "../errors/pendent-rental-error";

export const RENTAL_LIMITATIONS = {
  MIN: 1,
  MAX: 4,
  ADULTS_REQUIRED_AGE: 18,
  RENTAL_DAYS_LIMIT: 3
}

export async function getRentals() {
  const rentals = await rentalsRepository.getRentals();
  return rentals;
}

export async function getRentalById(rentalId: number) {
  const rental = await rentalsRepository.getRentalById(rentalId);
  if (!rental) throw notFoundError("Rental not found.");

  return rental;
}

export async function createRental(rentalInput: RentalInput) {
  const { userId, moviesId } = rentalInput;

  const user = await getUserForRental(userId); //(1)
  await checkUserAbleToRental(userId); //(2)
  await checkMoviesValidForRental(moviesId, user); //(3)

  const rental = await rentalsRepository.createRental(rentalInput); //(4) ok
  return rental;
}

export async function finishRental(rentalId: number) {
  const rental = await rentalsRepository.getRentalById(rentalId);
  if (!rental) throw notFoundError("Rental not found.");

  await rentalsRepository.finishRental(rentalId);
}

export async function getUserForRental(userId: number) {
  const user = await usersRepository.getById(userId);
  if (!user) throw notFoundError("User not found.");

  return user;
}

export async function checkUserAbleToRental(userId: number) {
  const rentals = await rentalsRepository.getRentalsByUserId(userId, false);
  if (rentals.length > 0) throw pendentRentalError("The user already have a rental!");
}

export async function checkMoviesValidForRental(moviesId: number[], user: User) {
  for (let i = 0; i < moviesId.length; i++) {
    const movieId = moviesId[i];
    const movie = await moviesRepository.getById(movieId);

    if (!movie) throw notFoundError("Movie not found.");
    if (movie.rentalId) {
      throw movieAlreadyInRental("Movie already in a rental.");
    }

    if (movie.adultsOnly && userIsUnderAge(user)) {
      throw insufficientAgeError("Cannot see that movie.");
    }
  }
}

export function userIsUnderAge(user: User) {
  const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
  return age < RENTAL_LIMITATIONS.ADULTS_REQUIRED_AGE;
}

