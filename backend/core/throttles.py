from rest_framework.throttling import UserRateThrottle

class TwoSecondThrottle(UserRateThrottle):
    # Translates to 1 request per 2 seconds
    rate = '30/min'