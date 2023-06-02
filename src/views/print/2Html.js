export default function getContent(VO) {
  const quote = VO.quote;
  const quoteItems = VO.itemList;
  //console.log(quoteItems[0]);
  console.log(quote);

  let returnMsg = `
    <div class="box" ref="box">
    <table style="border-collapse: collapse; width: 100%; height: 22.3281px; border-style: hidden;" border="0">
    <tbody>
    <tr >
    <td ><strong style="font-family: arial, helvetica, sans-serif;">
    Quotation No. ${quote.quoteNumber}
    </strong></td>
    <td style="text-align: right;"><strong style="font-family: arial, helvetica, sans-serif; text-align: right;">
    Date: ${getDate(quote.dateQuote)}
    </strong></td>
    </tr>
    </tbody>
    </table>
    <br>
    <p><span style="font-family: arial, helvetica, sans-serif;">
    ${quote.company}`;

  let inlineCounter = 0;
  if (quote.company.length > 50) {
    returnMsg += `<br>`;
  } else {
    inlineCounter += quote.company.length;
    returnMsg += ` | `;
  }
  returnMsg += `For: ${quote.contact}`;
  if (inlineCounter + quote.contact.length > 100) {
    returnMsg += `<br>`;
  } else {
  }
  returnMsg += `<br>
  ${quote.country}`;
  if (quote.greeting.length > 0) {
    returnMsg += `
    <p><span style="font-family: arial, helvetica, sans-serif;">${quote.greeting}</span></p>`;
  }
  
  returnMsg += `<br><table style="border-collapse: collapse; width: 95%; border-style: solid; margin-left: auto; margin-right: auto;" border="1" width="600">
    <tbody>
        <tr>
            <td style="text-align: center;" width="35"><span style="font-family: arial, helvetica, sans-serif;"><strong>Item No</strong></span></td>
            <td width="350"><span style="font-family: arial, helvetica, sans-serif;"><strong>Description</strong></span>
            </td>
            <td style="text-align: center;" width="45"><span style="font-family: arial, helvetica, sans-serif;"><strong>Quantity</strong></span>
            </td>
            <td style="text-align: center;" width="85"><span style="font-family: arial, helvetica, sans-serif;"><strong>Unit Price</strong></span></td>
            <td style="text-align: center;" width="85"><span style="font-family: arial, helvetica, sans-serif;"><strong>Total</strong></span>
            </td>
        </tr>`;
  let subtotal = 0;
  for (let i = 0; i < quoteItems.length; i++) {
    returnMsg += `
        <tr>
            <td style="text-align: center;" width="35"><span style="font-family: arial, helvetica, sans-serif;"><strong>${
              i + 1
            }</strong></span></td>
            <td width="350"><span style="font-family: arial, helvetica, sans-serif;"><strong>${
              quoteItems[i].item
            }</strong><br>${quoteItems[i].text}</span></td>
            <td style="text-align: center;" width="45" ><span style="font-family: arial, helvetica, sans-serif;">${
              quoteItems[i].quantity
            }</span></td>
            <td width="85" style = "text-align:right; ">
              <span style="font-family: arial, helvetica, sans-serif; margin-right:10px">${
                format(quoteItems[i].price)
              }</span></td>
            <td width="85" style = "text-align:right; ">
              <span style="font-family: arial, helvetica, sans-serif; margin-right:10px">${
                format(quoteItems[i].quantity * quoteItems[i].price)
              }</span></td>
        </tr>`;
    subtotal += quoteItems[i].quantity * quoteItems[i].price;
  }

  returnMsg += `
        <tr>
            <td style="text-align: right;" colspan="4" width="515" ><span
                    style="font-family: arial, helvetica, sans-serif;"><strong>Sub-total:</strong></span></td>
            <td width="94" style = "text-align:right; "><span style="font-family: arial, helvetica, sans-serif;margin-right:10px">${format(subtotal)}</span></td>
        </tr>
  `;
  if (quote.discountDirect !== 0) {
    returnMsg += `
    <tr>
        <td style="text-align: right;" colspan="4" width="515"><span
                style="font-family: arial, helvetica, sans-serif;"><strong>Direct discount:</strong></span></td>
        <td width="94" style = "text-align:right; "><span style="font-family: arial, helvetica, sans-serif;margin-right:10px">${format(quote.discountDirect)}</span></td>
    </tr>`;
  }
  if (quote.discount !== 0) {
    returnMsg += `
    <tr>
        <td style="text-align: right;" colspan="4" width="515" ><span
                style="font-family: arial, helvetica, sans-serif;margin-right:10px"><strong>Discount@${
                  format(quote.discount)
                }%:</strong></span></td>
        <td width="94" style = "text-align:right; "><span style="font-family: arial, helvetica, sans-serif;margin-right:10px">${
          format((quote.discount * subtotal) / 100)
        }</span></td>
    </tr>`;
  }
  if (quote.vat !== 0) {
    returnMsg += `
    <tr>
        <td style="text-align: right;" colspan="4" width="515"><span
                style="font-family: arial, helvetica, sans-serif;"><strong>VAT %:</strong></span></td>
        <td width="94" style = "text-align:right; "><span style="font-family: arial, helvetica, sans-serif;margin-right:10px">${quote.vat}%</span></td>
    </tr>`;
  }
  returnMsg += `
    <tr>
        <td style="text-align: right;" colspan="4" width="515"><span
                style="font-family: arial, helvetica, sans-serif;"><strong>Total:</strong></span></td>
        <td width="94" style = "text-align:right; "><span style="font-family: arial, helvetica, sans-serif;margin-right:10px">${format(quote.total)}</span></td>
    </tr>
  </tbody>
  </table>
  <p style="text-align: left;"><span style="font-family: arial, helvetica, sans-serif;"><strong>Terms and Conditions:</strong></span></p>
  <table rules=none frame=void style="border-collapse: collapse; width: 70%;" border="1" >
    <tbody>
      <tr  bgcolor='#eeeeee'>
        <td style="width: 30%;">
            <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px">Currency</span>
        </td>
        <td style="width: 70%;">
          <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px">${quote.currency}</span>
        </td>
    </tr>`;
  let arr = [];
  if (quote.tradeTerm !== "") arr.push(["Trade Term", quote.tradeTerm]);
  if (quote.price !== "") arr.push(["Price", quote.price]);
  if (quote.delivery !== "") arr.push(["Delivery", quote.delivery]);
  if (quote.payment !== "") arr.push(["Payment Term", quote.payment]);
  if (quote.validity !== "") arr.push(["Validity", quote.validity]);
  if (quote.warranty !== "") arr.push(["Warranty", quote.warranty]);
  console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 != 0) {
      returnMsg += `
      <tr bgcolor='#eeeeee'>
        <td style="width: 30%; >
            <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px ">${arr[i][0]}</span>
        </td>
        <td style="width: 70%;">
            <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px ">${arr[i][1]}</span>
        </td>
      </tr>
      `;
    } else {
      returnMsg += `
        <tr>
          <td style="width: 30%;">
             <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px">${arr[i][0]}</span>
          </td>
          <td style="width: 70%;">
             <span style="font-family: arial, helvetica, sans-serif; margin-left: 5px">${arr[i][1]}</span>
          </td>
        </tr>
        `;
    }
  }
  returnMsg += `
    </tbody>
  </table>
  <p><span style="font-family: arial, helvetica, sans-serif;">${quote.ending}</span></p>
    
  <div><span style="font-family: arial, helvetica, sans-serif; ">${quote.owner}</span></div>
  <div><span style="font-family: arial, helvetica, sans-serif; ">International Sales Support | Kehui International</span></div>
  </div>
 `
  
  ;

  return returnMsg;
}

function getDate(strDate) {
  return strDate;
}

function format(cellValue) {
  //console.log('totalFormat')
  cellValue = parseFloat(cellValue).toFixed(2);
  cellValue += "";
  if (!cellValue.includes(".")) cellValue += ".";

  return cellValue
    .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
      return $1 + ",";
    })
    .replace(/\.$/, "");
}