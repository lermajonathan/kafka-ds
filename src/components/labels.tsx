/* Kafka · built-in strings. English by default so the library has no opinion on language;
   pass `labelsEs` (or your own) to `KafkaProvider`. The library never imports an i18n or router package. */
import { createContext, useContext, type ReactNode } from 'react'

export interface Labels {
  /** Announced by screen readers while a button is busy. */
  loading: string
}

export const labelsEn: Labels = { loading: 'Loading' }
export const labelsEs: Labels = { loading: 'Cargando' }

const LabelsContext = createContext<Labels>(labelsEn)

/** Provides the built-in strings. Partial overrides are merged over English. */
export function KafkaProvider({ labels, children }: { labels?: Partial<Labels>; children: ReactNode }) {
  return <LabelsContext.Provider value={{ ...labelsEn, ...labels }}>{children}</LabelsContext.Provider>
}

export const useLabels = () => useContext(LabelsContext)
