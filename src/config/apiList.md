# Dev Match apis list

## authRouters

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET /profile/view
-PATCH /profile/update
-PATCH /profile/password

## connectionRequestRouter

-POST /request/send/interrested/:userid
-POST /request/send/ignored/:userid
-POST /request/review/accepted/:userid
-POST /request/review/rejected/:userid

## userRouter

-GET /user/connections
=GET /user/request/recieved
-GET /user/feed - gets you the profiles of other uses on platform
