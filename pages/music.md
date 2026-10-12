---
layout: page
label: music
section: hobbies

title: Música
permalink: /music/
---

{% assign categories = site.music | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = category.name %}
{% assign categoryItems = category.items | sort: "date" | reverse %}

## {{ categoryString }}

{% for item in categoryItems %}
- [{{ item.title }} ({{ item.date | date: "%Y" }})]({{ item.url | relative_url }})
{% endfor %}

{% endfor %}
