# Unsplash Clone

Check out the demo here : [Onsplash](https://onsplash-unsplash-clone.netlify.app/).

This is a clone of [Unsplash](https://unsplash.com/), and uses their api to fetch photos. These are then displayed using a masonry grid.

React has been used to build this.

## Features

* Masonry grid to display any number of images
* Responsive to screen width masonry grid, displays 1-3 columns depending on the space there is. A throttled screen resize function takes care of this.
* Infinite scrolling
* Lazy loading of images. Only load the image if the user has the image on screen, otherwise show a blurhash.
* Blurhash placeholders while the image loads
* Hover over an image to get an overlay on it

* Click an image to open a modal which displays the full quality image on further clicking
* The modal also shows a related images section, which has a masonry grid as well
* Close the modal by clicking outside it, or the close button or by pressing 'escape'

* Search for specific images by typing in the search bar and submitting
* Click the title to get to the github repository
* Cick the logo on the upper-left corner to reset

## Masonry

The masonry grid works by taking in as parameters the photos array, column width and number of columns.
Each image is taken, using a formula, resized to the column width and then the resized image's height is stored.
Then this image is added to the column of least height. This ensures the masonry layout flows nicely.

![Masonry Grid](https://i.imgur.com/QYmRASE.png)

The masonry grid is reusable, and has been implemented in the related images section too. Here the minimum number of columns is 2, instead of the default 1.

![Related images](https://i.imgur.com/0x23eR9.png)

The masonry grid can additionaly be supplied with 2 arrays of screen widths and image widths. Whenever the screen width is below a particular threshold, the corresponding image width for it is loaded. Here 2 columns have a max width of 463px while the default 3 columns have it at 416px.

![2 columns masonry](https://i.imgur.com/mEolTky.png)

![1 column masonry](https://i.imgur.com/yd3Wqyl.png)

## Modal

Click an image to open a modal. It can be closed by clicking outside, or the close button, or by pressing the 'escape' key.
On the top is the photographer's avatar and name, linked to their unsplash profile. It also has a related images section below, which implements a masonry layout as well.

![Modal](https://i.imgur.com/lT1sess.png)

## Search

Search for specific images by typing in the search bar. Go back to the default page by clicking the logo in the upper-left corner.

![Search Results](https://i.imgur.com/tC6uEOs.png)

## Blurhash

A blurhash is displayed while the image loads.

![Blurhash](https://i.imgur.com/NutJa5e.png)
