import { appKit } from "../lib/appkit";

export async function getSwapQuote({
  fromToken,
  toToken,
  amount,
}) {
  try {
    const quote = await appKit.getSwapQuote({
      fromToken,
      toToken,
      amount,
    });

    return quote;
  } catch (err) {
    console.error(err);
    throw err;
  }
}