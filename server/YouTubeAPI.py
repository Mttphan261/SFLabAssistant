from googleapiclient.discovery import build


api_key = 'AIzaSyAjK_ZZ7riJxHDISl_OLUMDP3DrZpi2tYg'

youtube = build('youtube', 'v3', developerKey=api_key)

# request = youtube.videos().list(
#     part='player',
#     id = ['jRAAaDll34Q', 'idYUy3hf3D0']
# )

# response = request.execute()

# print(response)

def fetch_videos():
    videos = []
    request = youtube.videos().list(
    part='player',
    id = ['jRAAaDll34Q', 'idYUy3hf3D0']
)

    response = request.execute()
    videos.append(response)
    print(type(videos))

fetch_videos()