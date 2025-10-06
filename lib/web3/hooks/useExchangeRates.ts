'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, ABIS, Currency, CURRENCY_SYMBOLS } from './useContracts'

export interface ExchangeRates {
  USD: number
  MXN: number
  BRL: number
  ARS: number
  COP: number
  GTQ: number
}

export function useExchangeRates() {
  const [apiRates, setApiRates] = useState<ExchangeRates | null>(null)
  const [isLoadingAPI, setIsLoadingAPI] = useState(false)

  /**
   * Get rate from oracle contract
   */
  const useOracleRate = (currency: Currency) => {
    const { data: rate, isLoading } = useReadContract({
      address: CONTRACT_ADDRESSES.exchangeRateOracle,
      abi: ABIS.exchangeRateOracle,
      functionName: 'getRate',
      args: [currency],
    })

    return {
      rate: rate ? Number(formatUnits(rate as bigint, 18)) : 1,
      isLoading,
    }
  }

  /**
   * Fetch rates from API
   */
  const fetchAPIRates = async () => {
    setIsLoadingAPI(true)
    try {
      const response = await fetch('/api/rates/current')
      const data = await response.json()
      setApiRates(data.rates)
    } catch (error) {
      console.error('Failed to fetch API rates:', error)
    } finally {
      setIsLoadingAPI(false)
    }
  }

  /**
   * Get hybrid rates (oracle + API fallback)
   */
  const useHybridRates = () => {
    const usd = useOracleRate(Currency.USD)
    const mxn = useOracleRate(Currency.MXN)
    const brl = useOracleRate(Currency.BRL)
    const ars = useOracleRate(Currency.ARS)
    const cop = useOracleRate(Currency.COP)
    const gtq = useOracleRate(Currency.GTQ)

    // Fetch API rates on mount
    useEffect(() => {
      fetchAPIRates()
    }, [])

    // Use oracle rates if available, otherwise API rates
    const rates: ExchangeRates = {
      USD: usd.rate || apiRates?.USD || 1,
      MXN: mxn.rate || apiRates?.MXN || 18.5,
      BRL: brl.rate || apiRates?.BRL || 5.0,
      ARS: ars.rate || apiRates?.ARS || 350,
      COP: cop.rate || apiRates?.COP || 4100,
      GTQ: gtq.rate || apiRates?.GTQ || 7.8,
    }

    return {
      rates,
      isLoading: usd.isLoading || isLoadingAPI,
      refetch: fetchAPIRates,
    }
  }

  /**
   * Convert between currencies
   */
  const convertCurrency = (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    rates: ExchangeRates
  ): number => {
    if (fromCurrency === toCurrency) return amount

    const fromSymbol = CURRENCY_SYMBOLS[fromCurrency]
    const toSymbol = CURRENCY_SYMBOLS[toCurrency]

    const fromRate = rates[fromSymbol as keyof ExchangeRates]
    const toRate = rates[toSymbol as keyof ExchangeRates]

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate
    const targetAmount = usdAmount * toRate

    return targetAmount
  }

  /**
   * Calculate fee (0.5%)
   */
  const calculateFee = (amount: number): number => {
    return amount * 0.005 // 0.5%
  }

  return {
    useOracleRate,
    useHybridRates,
    convertCurrency,
    calculateFee,
    fetchAPIRates,
  }
}
