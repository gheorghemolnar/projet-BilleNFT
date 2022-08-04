import React from "react";
// import useEth from "../../contexts/EthContext/useEth";
import { useForm } from "react-hook-form";

export default function FormEvent() {
  /* const { state: { artifact, contract } } = useEth(); */
  return(
    <main>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Achetez votre tickets</h1>
            {/* <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p> */}
          </div>
        </div>
      </section>
      <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" />
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" />
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </main>
  );
}

// export default function FormTicket() {
//   const { register, formState: { errors }, handleSubmit } = useForm();

//   const onSubmit = (data) => console.log(data);
  
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input {...register("firstName", { required: true })} />
//       {errors.firstName?.type === 'required' && "First name is required"}
      
//       <input {...register("lastName", { required: true })} />
//       {errors.lastName && <p>Last name is required</p>}

//       <input {...register("mail", { required: "Email Address is required" })} />
//       <p>{errors.mail?.message}</p>
      
//       <input type="submit" />
//     </form>
//   );
// }
