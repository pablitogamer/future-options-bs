/**
*  Returns cumulative normal distribution approximation
*
*  @param {number}
*  @return {number}
*/
export function normalCdf(x){
    let t = 1 / (1 + 0.2316419 * Math.abs(x));
    let d = 0.3989423 * Math.exp(-x * x/2);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x>0) {
        prob = 1 - prob; 
    }
    return prob; 
}
  
/**
* Returns normal distribution
*
* @param {number}
* @return {number}
*/
export function normalDist(x){
    return Math.exp(-x * x/2) / 2.50662827463;
}