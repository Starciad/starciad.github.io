---
layout: page
label: blog
section: blog

title: Blog
permalink: /blog/
---

{% for post in site.posts %}

- {{ post.author | upcase }}. *[{{ post.title }}]({{ post.url | relative_url }})*. {{ post.date | date: "%d/%m/%Y" }}.

{% endfor %}
