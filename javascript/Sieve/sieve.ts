class Sieve {
  // an arbitrary upper limit to chunk the sieve into multiple arrays
  private static MAX_ARRAY_SIZE = 1000000; // 1 million

  NthPrime(n: number): number {
    if (n < 0) throw new Error("n must be non-negative");
    if (n === 0) return 2;

    const upperLimit = this.calculateUpperLimit(n + 1);
    return this.findNthPrime(n, upperLimit);
  }

  /**
   * Finds the nth prime number by segmenting the search space.
   *
   * @param n the nth prime number to find
   * @param upperLimit the upper limit of the search space
   * @returns the nth prime number
   * @throws Error if the nth prime number is not found
   */
  private findNthPrime(n: number, upperLimit: number): number {
    let primeCount = 0;
    let offset = 0;

    while (offset < upperLimit) {
      const limit = Math.min(upperLimit - offset, Sieve.MAX_ARRAY_SIZE);
      const primes = this.generatePrimesSieve(offset, limit);
      const result = this.findTargetPrimeInSegment(
        primes,
        n - primeCount,
        offset
      );

      if (result !== null) {
        return result;
      }

      primeCount += primes.filter((prime) => prime).length;
      offset += limit;
    }

    throw new Error(`${n}th prime not found within calculated upper limit`);
  }

  /**
   * Finds the target prime in a segment of the prime number list.
   *
   * @param primes the segment of the prime number list
   * @param targetCount the count of the prime number to find
   * @param offset the offset of the segment in the prime number list
   * @returns the target prime number, or null if the target is not in the segment
   */
  private findTargetPrimeInSegment(
    primes: boolean[],
    targetCount: number,
    offset: number
  ): number | null {
    let count = 0;

    for (let i = 0; i < primes.length; i++) {
      if (primes[i]) {
        if (count === targetCount) {
          return i + offset;
        }
        count++;
      }
    }

    return null;
  }

  /**
   * Calculates an upper limit to check for prime numbers up to the nth prime,
   * using the prime number theorem approximation.
   * https://en.wikipedia.org/wiki/Prime_number_theorem#Approximations_for_the_nth_prime_number
   *
   * @param n the nth prime number to calculate
   * @returns the upper limit to check up to
   */
  private calculateUpperLimit(n: number): number {
    if (n < 6) {
      return 11; // fifth prime
    }
    return Math.ceil(n * (Math.log(n) + Math.log(Math.log(n))));
  }

  /**
   * Generates a boolean array where index `i` corresponds to whether
   * `i` is prime or not. The array is filled with `true` values,
   * then the composite numbers are set to `false` using the Sieve
   * of Eratosthenes algorithm.
   *
   * @param offset the lower limit to check for prime numbers
   * @param limit the upper limit to check for prime numbers
   * @returns a boolean array where `true` at index `i` means `i` is prime
   */
  private generatePrimesSieve(offset: number, limit: number): boolean[] {
    const primes = new Array(limit).fill(true);
    const upperLimit = offset + limit;

    if (offset === 0) {
      primes[0] = primes[1] = false;
    }

    for (let i = 2; i * i < upperLimit; i++) {
      if (i >= offset && !primes[i - offset]) {
        continue;
      }
      
      for (
        let j = Math.max(i * i, Math.ceil(offset / i) * i) - offset;
        j < limit;
        j += i
      ) {
        primes[j] = false;
      }
    }

    return primes;
  }
}

export default Sieve;
