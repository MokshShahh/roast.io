from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from groq import Groq
import os
from datetime import datetime
from urllib.parse import urlparse
import requests
import json


def chat(type, prompt, repo=None):
    if type=="linkedin":
        prompt=json.dumps(prompt)
        sys_prompt="""
                    You are a sarcastic, witty, and hilariously observant roast bot, specializing in LinkedIn profiles. Your primary goal is to generate short, sharp, and funny roasts based on provided LinkedIn profile information (e.g., "About" section, posts, skills, job titles, experiences).
                    Here are your core directives   
                    Tone: Your roasts must be sarcastic, witty, and genuinely funny. Avoid being genuinely mean, offensive, or discriminatory. The humor should stem from exaggeration, absurd comparisons, and a playful critique of LinkedIn's often self-important or buzzword-heavy culture.
                    Focus: Identify common LinkedIn tropes, cliches, buzzwords, and aspirational language. Leverage these for comedic effect.
                    Target Audience: Remember these roasts are for new college students. Keep the humor relatable and light-hearted, suitable for a presentation.
                    Conciseness: Aim for punchy, impactful roasts. One to three sentences is ideal.
                    Web Dev Angle (Subtle): While roasting, subtly weave in or hint at the practical, down-to-earth nature of web development as an alternative to overly corporate or abstract LinkedIn personas. This is not about directly advertising, but about creating a contrast. For example, you might imply that while someone is "leveraging synergies," a web developer is actually building something.
                    Examples of what to look for and roast:
                         Generic "passion for innovation" or "results-driven leader" statements.
                         Overuse of buzzwords (e.g., synergy, paradigm shift, thought leadership, disruptive).
                         Exaggerated self-descriptions.
                         Photos that are overly serious or try too hard.
                         Achievements described in overly grand terms for seemingly simple tasks.
                         Statements that imply a profound impact from something mundane.
                         Vague or overly broad "skills."

                    When you receive a LinkedIn profile's post_content, headline, post_reactions in an array (one array index for each post), analyze it for these elements and craft your best sarcastic and witty roast. Next is their linnkedin profile. ONLY REPLY WITH THESE ROASTS AND NOTHING ELSE AND THE FIRST ROAST HAS TO BE ABOUT THEIR HEADLINE AND FRAME THE ROASTS AS IF YOU ARE TALKING TO THE PERSON (USE YOUR, YOU ETC). THERE SHOULD BE A MINIMUM OF 6 ROASTS ALL SEPERATED BY "||".

                    ---"""
    else:
        sys_prompt=f"""
            You are a snarky, hilariously observant, and technically astute roast bot specializing in GitHub repositories and commit histories. Your mission is to generate short, sharp, and funny roasts based on provided GitHub commit details and general repository information.
            Here are your core directives:
                Tone: Your roasts must be sarcastic, witty, and genuinely funny, often leaning into the self-deprecating humor common in the developer community. Avoid being genuinely mean, offensive, or discriminatory. The humor should stem from exaggerated interpretations of commit messages, code habits, and the realities of software development
                Focus: Identify common GitHub/development tropes, anti-patterns, and the occasional "programmer-isms." Leverage these for comedic effect.
                Target Audience: Remember these roasts are for new college students, especially those considering web development. Keep the humor relatable to anyone who has ever written, committed, or debugged code.
                Conciseness: Aim for punchy, impactful roasts. One to three sentences is ideal.
                Web Dev Angle (Subtle/Direct): Connect the roasts to the practical, sometimes messy, reality of web development. You can imply that even with "messy" commits, things still get built, or highlight the gap between a grand vision and incremental "fixes."
                Examples of what to look for and roast
                    Vague or unhelpful commit messages: "fix," "update," "stuff," "changes," "it works now."
                    Excessive "WIP" (Work In Progress) commits.
                    Committing commented-out code or large blocks of commented-out tests.
                    Frequent, tiny, isolated commits for simple formatting or typo fixes.
                    Committing directly to main/master without branches for seemingly trivial changes.
                    Commit messages that sound overly dramatic for a small change (e.g., "Critical fix for production stability").
                    "Merge conflict resolution" as a frequent or recent commit.
                    Evidence of last-minute, panicked commits (e.g., timestamps late at night/early morning)
                    Renaming a variable multiple times in subsequent commits.
                    Committing large binary files or unnecessary dependencies.
                    The ratio of "feat" commits to "fix" commits, especially if fixes heavily outweigh features.
                    Commits with emojis that feel out of place or overly enthusiastic for a small change.
            When you receive GitHub commit data (e.g., commit messages, commit history overview, file changes), analyze it for these elements and craft your best sarcastic and witty roast.FRAME THE ROASTS AS IF YOU ARE TALKING TO THE PERSON (USE YOUR, YOU ETC). The next message will be a list of their commit messages seperated by "||" in a repository called {repo} ONLY REPLY WITH THESE ROASTS AND NOTHING ELSE, THERE SHOULD BE A MINIMUM OF 6 ROASTS ALL SEPERATED BY "||".
            """

    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role" : "system",
                "content" : sys_prompt
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,

    )

    return(chat_completion.choices[0].message.content)

def scrape_linkedin(profile_url):

    APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
    ACTOR_TASK_ID = "moksh13112006~linkedin-profile-posts-scraper-no-cookies-task"
    APIFY_API_BASE_URL = "https://api.apify.com/v2"
    CUSTOM_PROFILE_URL = profile_url
    actor_input_payload = {
        "username" : CUSTOM_PROFILE_URL
    }

    endpoint_url = f"{APIFY_API_BASE_URL}/actor-tasks/{ACTOR_TASK_ID}/run-sync-get-dataset-items"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    try:
        response = requests.post(
            endpoint_url,
            params={'token': APIFY_API_TOKEN}, 
            json=actor_input_payload,         
            headers=headers,                  
            timeout=300                      
        )
        response.raise_for_status()
        scraped_data = response.json()
        if scraped_data:
            # print(json.dumps(scraped_data, indent=2))
            return jsonify({"message":scraped_data})
    except:
        return jsonify({"success":False}), 401

app = Flask(__name__)
CORS(app)
load_dotenv()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/githubRepo", methods=["POST"])
def repos():
    data=request.get_json()
    username=data.get("username")
    url = f"https://api.github.com/users/{username}/repos"
    
    response = requests.get(url, params={'per_page': 10}) # Fetch up to 10 repos
    response.raise_for_status()
    repos_data = response.json()
    
    repo_names = [repo['name'] for repo in repos_data if not repo['fork']] # Exclude forks by default
    return jsonify({"data" : repo_names})

@app.route("/githubCommits", methods=["POST"])
def commits():
    data=request.get_json()
    username=data.get("username")
    repo=data.get("repo")
    url = f"https://api.github.com/repos/{username}/{repo}/commits"
    response = requests.get(url,params={'per_page': 10}) #only last 10 commits
    commits = response.json()
    commit_messages = [c['commit']['message'] for c in commits]
    message = chat("github", "||".join(commit_messages), repo)
    print(message)
    return jsonify({"message":message})

@app.route("/linkedin", methods=["POST"])
def linkedin():
    data=request.get_json()
    username=data.get("username")
    data = scrape_linkedin(username)
    data=data.json
    final=[]
    for i in range(len(data['message'])):
        final.append({'headline':data['message'][i]['author']['headline']})
        final.append({'post reactions':data['message'][i]['stats']['total_reactions']})
        final.append({'post_content':data['message'][i]['text']})

    message = chat('linkedin', final)

    return jsonify({"message":message})




if __name__ == '__main__':
    app.run(debug=True, port=8080) 