/**
 * Module for calculate options prices over a future contract based on a Black-Scholes model.
 * Also calculate greeks: Delta, Gamma, Vega and Theta
 * @module future-options-bs
 * @author Pablo Praderio <pabloupraderio@gmail.com>
 * @version 1.0.0
 */

import { normalDist, normalCdf } from "./math/statFunctions.js";

/**
 * Calculate CALL price over a future contract
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @param {number} [decimal=2] - number of decimals to return, 2 by default
 * @returns {number} - CALL price with [decimal] decimals
 */
export function callPrice(fut ,sp ,vol ,t ,r = 0, decimal = 2){
    let call = (Math.exp(-r*t) * (fut * normalCdf(D1(fut,sp,vol,t)) - sp * normalCdf(D2(fut,sp,vol,t))));
    return Math.round(call * 10 * decimal) / (10 * decimal);
}
  

/**
 * Calculate PUT price over a future contract
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @param {number} [decimal=2] - number of decimals to return, 2 by default
 * @returns {number} - PUT price with [decimal] decimals
 */
export function putPrice(fut, sp, vol, t, r = 0, decimal = 2){
  let put = Math.exp(-r*t) * (sp * normalCdf(-D2(fut,sp,vol,t)) - fut * normalCdf(-D1(fut,sp,vol,t)));
  return Math.round(put * 10 * decimal) / (10 * decimal);
}

/**
 * Calculate greek: Delta of a CALL
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @returns {number}
 */
export function deltaCall(fut,sp,vol,t,r=0){
  return Math.exp(-r * t) * normalCdf( D1(fut,sp,vol,t));
}

/**
 * Calculate Delta of a PUT
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @returns {number}
 */
export function deltaPut(fut,sp,vol,t,r=0){
  return -Math.exp(-r * t) * normalCdf(-D1(fut,sp,vol,t));
}

/**
 * Calculate Gamma of an option
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @returns {number}
 */
export function gamma(fut,sp,vol,t,r=0){
  return Math.exp(-r*t) * normalDist(D1(fut,sp,vol,t)) / (vol * fut * Math.sqrt(t));
}

/**
 * Calculate Vega of an option
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @returns {number}
 */
export function vega(fut,sp,vol,t,r=0){
  return (fut * Math.exp(-r*t) * normalDist(D1(fut,sp,vol,t)) * Math.sqrt(t) / 100);
}

/**
 * Calculate Theta of a CALL
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @param {number} [days=365] - Number of days per year 
 * @returns {number}
 */
export function thetaCall(fut,sp,vol,t,r=0,days=365){
  let theta = (-fut * Math.exp(-r*t) * normalDist(D1(fut,sp,vol,t)) * vol / (2*Math.sqrt(t)) +
              r* fut * Math.exp(-r*t) * normalCdf(D1(fut,sp,vol,t)) - r * sp * Math.exp(-r*t) * normalCdf(D2(fut,sp,vol,t)) )/days;
  return theta;  
}

/**
 * Calculate Theta of a PUT
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility 
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @param {number} [days=365] - Number of days per year 
 * @returns {number}
 */
export function thetaPut(fut,sp,vol,t,r=0,days=365){
  let theta = (-fut * Math.exp(-r*t) * DistNormal(D1(fut,sp,vol,t)) * vol / (2*Math.sqrt(t)) -
              r* fut * Math.exp(-r*t) * normalCdf(-D1(fut,sp,vol,t)) + r * sp * Math.exp(-r*t) * normalCdf(-D2(fut,sp,vol,t)) )/days;
  return theta;
}
  

/**
 * Calculate implied volatility 
 * @param {string} type  - CALL or PUT
 * @param {number} prime - Prime price
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} t - time as a proportion of a year
 * @param {number} r - anual interest rate, 0 by default
 * @param {number} [error=0.02] - Desired error as a proportion of the prime 0.02 by default
 * @returns {number}
 */
export function  impliedVolat(type,prime,fut,sp,t,r=0,error=0.02){
  type = type.toUpperCase();
  let iv = 0.2;
  let piv = 0;
  let veg = 0;
  let err = 1;
  do{
    if(type == "CALL"){
      piv = callPrice(fut, sp, iv, t, r);
    }else if(type == "PUT"){
      piv = putPrice(fut, sp, iv, t, r);
    }else{return undefined;}
    veg = vega(fut,sp,iv,t,r);
    err = prime - piv;
    iv = iv + (err / veg)/100;
    err = Math.abs(err);
  }while(err > (prime * error) );
  return iv;
}
  
  
/**
 * 
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility
 * @param {number} t - time as a proportion of a year
 * @returns {number}
 */
function D1(fut,sp,vol,t){
  return (Math.log(fut/sp) + (Math.pow(vol,2) * t / 2) ) / (vol * Math.sqrt(t));
}
  
/**
 * 
 * @param {number} fut - underlying future price
 * @param {number} sp - strike price
 * @param {number} vol - volatility
 * @param {number} t - time as a proportion of a year
 * @returns {number}
 */
function D2(fut,sp,vol,t){
  return (Math.log(fut/sp) - Math.pow(vol,2) * t / 2) / (vol * Math.sqrt(t));
}

export default {
  callPrice,
  putPrice,
  deltaCall,
  deltaPut,
  gamma,
  vega,
  thetaCall,
  thetaPut,
  impliedVolat
}
