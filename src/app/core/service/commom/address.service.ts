export class AddressDisplay {
    setDisplayAddressLine(addressLine1, addressLine2, addressLine3, postalCode) {

      const address1 = !this.isEmptyOrNullOrUndefined(addressLine1) ? addressLine1 + ', ' : '';
      const address2 = !this.isEmptyOrNullOrUndefined(addressLine2) ? addressLine2 + ', ' : '';
      const address3 = !this.isEmptyOrNullOrUndefined(addressLine3) ? addressLine3 + ', ' : '';
      const postal = !this.isEmptyOrNullOrUndefined(postalCode) ? postalCode : '';
  
      return address1 + address2 + address3 + postal +'.';
    }
    isEmptyOrNullOrUndefined(str: string) {
        return (str === "" || str === null || str === "null" || str === undefined || str === "undefined");
    }
}  