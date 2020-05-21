import moment from 'moment';

class Product {
  constructor(
    id,
    ownerId,
    reservedUserId,
    newOwnerId,
    category,
    condition,
    style,
    material,
    color,
    title,
    image,
    address,
    phone,
    description,
    length,
    height,
    width,
    price,
    date,
    status,
    pauseDate,
    readyDate,
    reservedDate,
    reservedUntil,
    collectedDate,
    projectId,
    internalComments
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.reservedUserId = reservedUserId;
    this.newOwnerId = newOwnerId;
    this.category = category;
    this.condition = condition;
    this.style = style;
    this.material = material;
    this.color = color;
    this.title = title;
    this.image = image;
    this.address = address;
    this.phone = phone;
    this.description = description;
    this.length = length;
    this.height = height;
    this.width = width;
    this.price = price;
    this.date = date;
    this.status = status;
    this.pauseDate = pauseDate;
    this.readyDate = readyDate;
    this.reservedDate = reservedDate;
    this.reservedUntil = reservedUntil;
    this.collectedDate = collectedDate;
    this.projectId = projectId;
    this.internalComments = internalComments;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Product;
