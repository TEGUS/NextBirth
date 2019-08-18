export var Session: any = {
  user: null,
  toke: null,
  mode: null
};


export var TimerCounter:any = {
  value:5,//minutes
  timer:null,
  reload:null,
  tempsDatente:{
      value:1000*60*60,//microsecondes
      timer:null,
      reload:null
  }
}


export var contactsInfo: any = {
  email: 'seid.rahim2@gmail.com',
  phoneNumber: '+237699129993'
}


export var imagesB64: Array<any> = [
  "data:image/jpeg;base64,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",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXh4eGjo6OgoKDk5OTg4OCkpKTY2NixsbGnp6fc3NzV1dXDw8PR0dG+vr6urq63t7fKysrCwsLOD/OwAAAFa0lEQVR4nO2d25arIAxAlSAXFaH//7MH6nROL06rcgtd2U+deXKvIGAksesIgiAIgiAIgiAIgiAIgiAIgiAIgiBKAwBcjwHN/e/al5MY6PQ4WaWGFaXsNOrueyyhc1Yxxvr/+L+Udd/iOJtHuztLM9e+uASMdtjS+5Ec7Fj7AuMAbTfDdx9Iq1seq06997s6Klf7Ms8C3H72uzpa3mQYYdwRwFsYxwYVYRx2+gWG9hTBHRH0iq41xfmYoFdsa2kEcVTQK4qWoijUYcG+V6L2Ze8H5AnBvpftBHHau0w8wqbaF76XQ+vEPUMjm1SQ50Log9jGOAV3VtArNrEq8uW0YN8vvPblfyYmhI0E8dxKcUPWvvzPnJ5IV/BPp2BiBqkfpgb7MIW4EPogYjcUcSH0QUS+O4WTG7Y7wwl5EHemZt4Y2toK79Exy/3KomtLvOXUg+EjyB8Tx9hB6ocp7hVxTmCIOmETtyn9MUS9NY1fLLAvF2RIhg0Yfv1M8/2rRTdGC/Y97hVfJ9i14d6X8rgsTUDiTrfFJjHwpzHiJ1PkU6kfptGGuAepD2LsI/CCPITRwxT9II1+ykf+hB+Im02xz6RXojKm2LOlKxEJReypxB9OnDS5MTQRwog7sYm7MHD6LXALb4BXTmZNkWdK7zmXzMCdvnjmxK3ITO2LPgRfjiqydm7CFX7w2BBD/uC7gT6kyCTu3MU2B/Y2jexlXrjsNrzUvtSTwPymXOYugO2d8f4F+I5Vg5k2qy1uzJ92cAvuFPdnAJz8s/SJMem+oNYSOmGX/lWS9YsV31KBCHo2ocRyrUNcfygzN1209gIAH52xVkpprXEj/4LR+Uqob+acd99X50wQBEEQBEEQBEEQBNEKITHDAzpw/bX+8wsIWSc9u8lYuahhzST2g1qkNZObddtZKQAuRmeCWP/ase36H69q3ChaTC360GhnpNruRfdkqqRxuqlghuSv3QjbW83ehjRx7UvfAXR8tstwwO6/5bDYmeN+kwEgnD1jd2dpncA7XoWTMXq/ktJhPMAHMNvdHeg+Wio7IwskiElFR+/BkakJU+8vYZKF705SGSSD1Q/PpOG7c2R+sNbW67pRbrzBTubYy8onMkHbjH6rY80OrqBNpvH54MhMNcc5w/yy6aiqnLnZ3WE2iWONLrX7O8wmUVSlZ5yjDVjjKXy8b8+JvNQwU/IUccFb8E6x4DHbKoIFFUtOos+KRQZqfLl2hGKRwqgErS8iFAt0qE/QNSGG/B0XoNpNuMJs7nE6V/UL5N6jVg5h/iUjuvFjAsWsuQ24IDC8ZL0T45uzxJO1EW+CtojxZG27ENkkOA1ZWw3XXysCOdeLo5WhOchcbSpq+3nyZsJTtJyLI38Dm8rjlOVv2p6gU3AMJboMJ2ike54ijSVgqmhYqLFEtTRGscYStVbFgn0Xjne9SCJYsnOGqKDIlpIvvUHv6iWQVHAo+xYRxsJRZEvp7wce+H5jEsEK34AEXTCKbKnxohvKTTd+kqnzJr/Uulix/1CZF6VlX40+UyC7yOq254HcJ06Yqn7wK++UylB8dSbB1wL+FETyVctc+xu/j6mt9gPwS4bzbYxdEJ3dB5H8rRuzmM4Ie/ieD8Uf8FMOXZdB0FOyo6asn1B2WAKd5rg3U/UOlH4ChImOI+sNshvwEeimJapmZplwlwV1185l8mSKgw2yjQ5nAGL6u8/e3+GTE+KKp2eAi4vcX0UTShAvAtH6vgvoxmsd244Ky8G6Ef3dt8laSHqtRtwQDf8cFtta+egLAFyLOXgqpYYb/ndwm4VusQR4Cwh4VTEGxFWs7cgRBEEQBEEQBEEQBEEQBEEQBEEQBNEi/wClZUNLbtBLkwAAAABJRU5ErkJggg==",
  "data:image/png;base64,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",

]
