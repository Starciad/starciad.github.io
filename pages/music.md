---
layout: page
label: music
section: hobbies

title: Música
permalink: /music/
---

{% assign categories = site.music | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}
{% assign categoryItems = category.items | sort: "date" | reverse %}

## {{ categoryString.label }}

{% for item in categoryItems %}
- [{{ item.title }} ({{ item.date | date: "%Y" }})]({{ item.url | relative_url }})
{% endfor %}

{% endfor %}
