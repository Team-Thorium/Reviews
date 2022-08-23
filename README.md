<div id="top"/>

# Reviews API
A microservice backend API development for Ratings and Reviews of a modern retail e-commerce website.

## Tech Stack
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
!

## API

### List Reviews
Returns a list of reviews for a particular product. This list does not include any reported reviews.
```
GET /reviews
```
Query Parameters
| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| page | integer | Selects the page of results to return. Default 1. |
| count | integer | Specifies how many results per page to return. Default 5. |
| sort | text | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |
| product_id | integer | Specifies the product for which to retrieve reviews. |

Response
```
Status: 200 OK
```
```
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
```



### Get Review Metadata

Returns review metadata for a given product.

```
GET /reviews/meta
```
Query Parameters
| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| product_id | integer | Specifies the product for which to retrieve reviews. |

Response
```
Status: 200 OK
```
```
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
```

### Add a Review
Adds a review for the given product.
```
POST /reviews
```
Body Parameters
| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| product_id | integer | Required ID of the product to post the review for |
| rating | integer | Integer (1-5) indicating the review rating |
| summary | text | Summary text of the review |
| body | text | Continued or full text of the review |
| recommend | bool | Value indicating if the reviewer recommends the product |
| name | text | Username for question asker |
| email | text | Email address for question asker |
| photos | [text] | Array of text urls that link to images to be shown |
| characteristics | object | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |

Response
```
Status: 201 CREATED
```


### Mark Review as Helpful
Updates a review to show it was found helpful.

```
PUT /reviews/:review_id/helpful
```
Parameters
| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| review_id | integer | Required ID of the review to update |

Response
```
Status: 204 NO CONTENT
```

### Report Review
Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.
```
PUT /reviews/:review_id/report
```
Parameters
| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| review_id | integer | Required ID of the review to update |

Response
```
Status: 204 NO CONTENT
```


## Getting Started

### Installation

From the root directory, run the following commands in your terminal.

1. To install all dependencies

```
npm install
```

2. Copy .envsample as .env and define environment variables

3. To start dev server

```
npm run start-dev
```

4. To connect to the server
```
npm start
```

<p align="right">(<a href="#top">back to top</a>)</p>
