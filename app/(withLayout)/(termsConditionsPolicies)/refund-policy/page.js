export default function RefundPolicy() {
  const refundPolicyMarkdown = `
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga autem
      eveniet reprehenderit eaque? Explicabo officia, odit sint voluptatem
      corrupti eligendi ipsa, enim optio quam porro neque in pariatur ullam
      fuga totam. Neque ad libero in vel eius minima nobis natus iusto nemo!
      Ad est quis, laborum ipsum incidunt aliquam reprehenderit?
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, quidem
      dolorem sapiente id non nostrum cumque porro. Doloribus magni nobis
      earum vero enim dolore nisi!
    </p>
    <h2>Heading 1</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus
      quis nihil, magni suscipit quidem deserunt dolores magnam nostrum
      provident natus ullam aut asperiores ipsam nemo modi labore adipisci
      veniam facere harum. Incidunt atque perspiciatis sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
      pariatur, deserunt sequi ipsum ipsa tenetur officia? Magnam magni sunt
      quae debitis est! Odit eligendi culpa quia eos! Laboriosam recusandae
      possimus labore ipsa atque obcaecati assumenda ex cumque numquam,
      eligendi eum dicta impedit consequuntur accusantium, ullam odit
      exercitationem. Aliquid, magni ut!
    </p>
    <h2>Heading 2</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat commodi
      tempore aut illum maiores! Similique eum quas placeat nesciunt fuga
      animi ea obcaecati nam earum doloribus nulla minus dolorum, possimus
      debitis accusamus. Facilis veritatis dolor beatae quisquam deleniti
      nesciunt porro.
    </p>
    <h2>Heading 3</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius
      rem blanditiis consectetur labore quidem explicabo nulla, voluptatem
      repellendus ut reiciendis doloribus ipsam ipsum? Velit consectetur ab
      rem vitae natus praesentium sequi ipsam quidem incidunt at voluptates
      laborum, quas pariatur. Ipsam nulla numquam, incidunt iste fugit iure
      dolores voluptatem officia.
    </p>
    <h2>Heading 4</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus
      quis nihil, magni suscipit quidem deserunt dolores magnam nostrum
      provident natus ullam aut asperiores ipsam nemo modi labore adipisci
      veniam facere harum. Incidunt atque perspiciatis sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
      pariatur, deserunt sequi ipsum ipsa tenetur officia? Magnam magni sunt
      quae debitis est! Odit eligendi culpa quia eos! Laboriosam recusandae
      possimus labore ipsa atque obcaecati assumenda ex cumque numquam,
      eligendi eum dicta impedit consequuntur accusantium, ullam odit
      exercitationem. Aliquid, magni ut!
    </p>
    <h2>Heading 5</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius
      rem blanditiis consectetur labore quidem explicabo nulla, voluptatem
      repellendus ut reiciendis doloribus ipsam ipsum? Velit consectetur ab
      rem vitae natus praesentium sequi ipsam quidem incidunt at voluptates
      laborum, quas pariatur. Ipsam nulla numquam, incidunt iste fugit iure
      dolores voluptatem officia.
    </p>
    <h2>Heading 6</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus
      quis nihil, magni suscipit quidem deserunt dolores magnam nostrum
      provident natus ullam aut asperiores ipsam nemo modi labore adipisci
      veniam facere harum. Incidunt atque perspiciatis sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias aliquid,
      iste natus molestias laborum quis corporis quo perspiciatis amet fugit.
    </p>
  `;

  return (
    <>
      <h1>Refund Policy</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: refundPolicyMarkdown,
        }}
      ></div>
    </>
  );
}
