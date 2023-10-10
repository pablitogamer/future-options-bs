# Options calculation over future contracts based on Black-Scholes-Merton model

This Module calculate price, implied volatility, and greeks of options over futures based on Black-Scholes-Merton model.

### Installation

`> npm i future-options-bs`

### Import

You should import by ES6 modules calling just calling some especific function:
```javascript
import { callPrice } from "futures-options-bs";
const myCall = callPrice(300, 350, 0.2, 0.55, 0.05);
```
or the hole as an object:
```javascript
import option from "futures-options-bs";
const myCall = option.callPrice(300, 350, 0.2, 0.55, 0.05);
```

### Functions contained in this module

- callPrice(fut, sp, vol, t, r, decimal)  Returns CALL price
- putPrice(fut, sp, vol, t, r, decimal)  Returns PUT price
- deltaCall(fut,sp,vol,t,r)  Returns Delta of a CALL
- deltaPut(fut,sp,vol,t,r)  Returns Delta of a PUT
- gamma(fut,sp,vol,t,r)  Returns Gamma of both types
- vega(fut,sp,vol,t,r)  Returns Vega of both types
- thetaCall(fut,sp,vol,t,r,days)  Returns Theta of a CALL
- thetaPut(fut,sp,vol,t,r,days)  Returns Theta of a PUT
- impliedVolat(type,prime,fut,sp,t,r,error)  Returns an implied volatility of an option

### Variables used in functions

- fut - price of an underlying future contract
- sp - strike price
- vol - annual volatility
- t - time as a proportion of a year
- r - anual interest rate, 0 by default
- decimal - optional parameter - number of decimals tu return, 2 by default
- days - number of days per year, 365 by default
- type - "CALL" or "PUT"
- error - optional parameter - Desired error as a proportion of the prime 0.02 by default


## Notes

Calculate of probabilities are made by an aproximation function method, but its error its quite small. The statistics functions are in a separate module for future improvements or changes in javascript functions that currently do not support these statistical functions.

These functions does not validate variables types, so inputs of *string* instead of *number* will result in a **NaN** or **undefined** output.