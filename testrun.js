const utcstring = "2022-08-08T05:48:31Z";
const utcdate = new Date(utcstring);
const newdate = utcdate.toLocaleString();
const localeDate = new Date(newdate);
console.log(localeDate.toISOString());
