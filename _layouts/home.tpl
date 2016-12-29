---
layout: default
---

<div class="home">

  
  {{ content }}

  
    

    
    {% for collection in site.collections | sort: 'title' %}
    <h2>{{ collection.title }}</h2>
    {% assign sortedPosts = collection.docs | sort: 'chapter' %}
    {% for post in sortedPosts | sort: 'title' %}
    <ul class="post-list">
      <li>
        <span class="post-meta"><span class="">Lesson </span>{{ post.chapter}}</span>
        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
    </ul>
    {% endfor %}
    {% endfor %}
    

  

  <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | relative_url }}">via RSS</a></p>

</div>