'use client'

export const PrintButton = () => {
  return (
    <button
      onClick={() => window.print()}
      className="inline-block rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
    >
      Imprimir
    </button>
  )
}

export default PrintButton
