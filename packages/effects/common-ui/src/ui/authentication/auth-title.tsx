import type { ReactNode } from 'react';

interface AuthTitleProps {
  description?: ReactNode;
  title?: ReactNode;
}

function AuthTitle({ description, title }: AuthTitleProps) {
  return (
    <div className="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mb-3 text-3xl leading-9 font-bold tracking-tight text-foreground lg:text-4xl">
        {title}
      </h2>
      <p className="lg:text-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export { AuthTitle };
