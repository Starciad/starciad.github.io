---
layout: page
label: paintings
section: hobbies

title: Pinturas
permalink: /paintings/
---

{% assign paintings = site.paintings | sort: "date" | reverse %}

{% for painting in paintings %}
- [{{ painting.title }} ({{ painting.date | date: "%Y" }})]({{ painting.url | relative_url }})
{% endfor %}
