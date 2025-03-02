# Datalayer  
## Table of content  
- [page_view](#page_view)  
- [view_item](#view_item)  
- [view_items](#view_items)  
## page_view  
An event that detects when a page is viewed  
**pages:** All pages  
**Element target:** document  
**trigger datalayer:** DOMContentLoaded  
**Functions to execute:**  checkIsTested, retrieveFromEndpoint, getData, formatString, pushData   
### Event:  
**event**: The event name you want to use. | **string**  
**page_location**: The full URL of the current page | **string**  
**page_path**: The path of the current page | **string**  
**page_title**: The title of the current page | **string**  
**custom_tested**: A boolean indicating if the function tested has been tested | **boolean**  
**custom_callback**: A callback function response | **boolean**  
**custom_user**: The unique ID of the user | **number**  
#### Template:  
```json   
{
  "event": "page_view",
  "page_location": "w__location.href",
  "page_path": "w__location.pathname",
  "page_title": "w__document.title",
  "custom_tested": "c__checkIsTested",
  "custom_callback": "c__retrieveFromEndpoint.callback",
  "custom_user": "c__retrieveFromEndpoint.userID"
}  
```  
#### Result:  
```json   
{
  "event": "page_view",
  "page_location": "https://www.google.com.br/search",
  "page_path": "/search",
  "page_title": "google",
  "custom_tested": true,
  "custom_callback": true,
  "custom_user": "768103821926"
}  
```  
## view_item  
An event to detects when a product item is viewed  
**pages:** All pages with products  
**Element target:** .productCard  
**trigger datalayer:** DOMContentLoaded  
**Functions to execute:**  retrieveProductItem, getData, formatString, pushData   
### Event:  
**event**: The event name you want to use. | **string**  
**ecommerce -> items (List) -> item_name**: Product name | **string**  
**ecommerce -> items (List) -> item_id**: Product id | **number**  
**ecommerce -> items (List) -> item_brand**: The product brand | **string**  
**ecommerce -> items (List) -> item_category**: The product category | **string**  
**ecommerce -> items (List) -> item_variant**: The product variant | **string**  
**ecommerce -> items (List) -> price**: The product price | **number**  
#### Template:  
```json   
{
  "event": "view_item",
  "ecommerce": {
    "items": [
      {
        "item_name": "c__retrieveProductItem.name",
        "item_id": "c__retrieveProductItem.id",
        "item_brand": "c__retrieveProductItem.brand",
        "item_category": "c__retrieveProductItem.category",
        "item_variant": "c__retrieveProductItem.variant",
        "price": "c__retrieveProductItem.price"
      }
    ]
  }
}  
```  
#### Result:  
```json   
{
  "event": "view_item",
  "ecommerce": {
    "items": [
      {
        "item_name": "cool-shirt",
        "item_id": "8321098316",
        "item_brand": "crowthes",
        "item_category": "apparel",
        "item_variant": "blue",
        "price": 19.99
      }
    ]
  }
}  
```  
## view_items  
An event to detects when a product list is viewed  
**pages:** All pages with products  
**Element target:** .productCard  
**trigger datalayer:** DOMContentLoaded  
**Functions to execute:**  retrieveProductItems, createArrayTemplate, createArrayTemplate, getData, formatString, pushData   
### Event:  
**event**: The event name you want to use. | **string**  
**ecommerce -> items (List) -> item_name**: Product name | **string**  
**ecommerce -> items (List) -> item_id**: Product id | **number**  
**ecommerce -> items (List) -> item_brand**: The product brand | **string**  
**ecommerce -> items (List) -> item_category**: The product category | **string**  
**ecommerce -> items (List) -> item_variant**: The product variant | **string**  
**ecommerce -> items (List) -> price**: The product price | **number**  
**ecommerceSpecial -> items (List) -> item_name**: Product name | **string**  
**ecommerceSpecial -> items (List) -> item_id**: Product id | **number**  
**ecommerceSpecial -> items (List) -> item_brand**: The product brand | **string**  
**ecommerceSpecial -> items (List) -> item_category**: The product category | **string**  
**ecommerceSpecial -> items (List) -> item_variant**: The product variant | **string**  
**ecommerceSpecial -> items (List) -> price**: The product price | **number**  
#### Template:  
```json   
{
  "event": "view_items",
  "ecommerce": {
    "items": [
      {
        "item_name": "c__retrieveProductItems[].name",
        "item_id": "c__retrieveProductItems[].id",
        "item_brand": "c__retrieveProductItems[].brand",
        "item_category": "c__retrieveProductItems[].category",
        "item_variant": "c__retrieveProductItems[].variant",
        "price": "c__retrieveProductItems[].price"
      }
    ]
  },
  "ecommerceSpecial": {
    "items": [
      {
        "item_name": "c__retrieveProductItems[].name",
        "item_id": "c__retrieveProductItems[].id",
        "item_brand": "c__retrieveProductItems[].brand",
        "item_category": "c__retrieveProductItems[].category",
        "item_variant": "c__retrieveProductItems[].variant",
        "price": "c__retrieveProductItems[].price"
      }
    ]
  }
}  
```  
#### Result:  
```json   
{
  "event": "view_items",
  "ecommerce": {
    "items": [
      {
        "item_name": "cool-shirt",
        "item_id": "8321098316",
        "item_brand": "crowthes",
        "item_category": "apparel",
        "item_variant": "blue",
        "price": 19.99
      },
      {
        "item_name": "cool-hat",
        "item_id": "1698748832",
        "item_brand": "crowthes-master",
        "item_category": "apparel",
        "item_variant": "blues",
        "price": 27.87
      }
    ]
  },
  "ecommerceSpecial": {
    "items": [
      {
        "item_name": "cool-shirt",
        "item_id": "8321098316",
        "item_brand": "crowthes",
        "item_category": "apparel",
        "item_variant": "blue",
        "price": 19.99
      },
      {
        "item_name": "cool-hat",
        "item_id": "1698748832",
        "item_brand": "crowthes-master",
        "item_category": "apparel",
        "item_variant": "blues",
        "price": 27.87
      }
    ]
  }
}  
```  
