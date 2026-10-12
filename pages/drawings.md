---
layout: page
label: drawings
section: hobbies

title: Desenhos
permalink: /drawings/
---

{% assign drawings = site.drawings | sort: "date" | reverse %}

{% for drawing in drawings %}

- [{{ drawing.title }} ({{ drawing.date | date: "%Y" }})]({{ drawing.url | relative_url }})

{% endfor %}
