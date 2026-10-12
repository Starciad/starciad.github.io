---
layout: page
label: animations
section: hobbies

title: Animações
permalink: /animations/
---

{% assign animations = site.animations | sort: "date" | reverse %}

{% for animation in animations %}
- [{{ animation.title }} ({{ animation.date | date: "%Y" }})]({{ animation.url | relative_url }})
{% endfor %}
